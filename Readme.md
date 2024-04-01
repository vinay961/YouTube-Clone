Here we are developing the YouTube Clone where we are utilizing all the concept of backend from beggining to advance.

aggregation pipeline in mongoDB --> it a powerfull feature that allow to process and transform the date within collection

[
    {}, --> stage-1
    {}, --> stage-2
    {}  --> stage-3
]

the aggregation pipeline consist stages and each stage perform a specific operation on input documents, and output of one stage became input for other stage.  we can chain multiple stages together to create a data processing pipeline.

# Some common used aggregation stages:

$match: Filters documents based on specified conditions.
$group: Groups documents by a specific field and calculates aggregate values (e.g., sum, average).
$project: Shapes the output by specifying which fields to include or exclude.
$sort: Sorts documents based on specified criteria.
$limit: Limits the number of output documents.
$unwind: Deconstructs an array field into multiple documents.

